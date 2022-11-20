package main

import (
	"crypto/tls"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/urfave/cli/v2"
	"go.uber.org/zap"
)

// HttpResponseEntry is used to store the cached response
// inside the ARC cache.
type HttpResponseEntry struct {
	Header http.Header
	Body   []byte

	// hit is used to know when this entry has been hit for the last time
	hit time.Time
}

const (
	// CacheMaxAge is the time to wait before expiring a cached response
	// NOTE: 2min seems to be a good option for the cache age; it allows fast refresh
	// 	     on the UI and, if someone update something on TrueNAS, it will be updated
	//	     in the next 2min.
	CacheMaxAge = 2 * time.Minute
	// CacheSize is the size of the ARC cache
	// NOTE: 10Mi seems to be a good value; on large response, I reach ~500ko maximum for a
	//	     response. With this size, we can store around 20 big entries without issues.
	CacheSize = 10 * 1024 * 1024 * 1024
)

func ProxyAction(log *zap.Logger) cli.ActionFunc {
	return func(ctx *cli.Context) error {
		truenasToken := ctx.String("truenas.token")
		truenasURL, err := url.Parse(ctx.String("truenas.url"))
		if err != nil {
			return err
		}

		// NOTE: in order to have the proxy mechanism, we will use the
		//		 httputil.ReverseProxy as handler.
		log.Info(fmt.Sprintf("setup reverse proxy to %s", truenasURL.String()))
		proxy := httputil.NewSingleHostReverseProxy(truenasURL)
		proxy.Transport = http.DefaultTransport
		if ctx.Bool("tls.insecure") {
			log.Warn("insecure mode enabled; all communication between TrueNAS and API will not be encrypted")
			proxy.Transport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}
		}

		// NOTE: we will use a router to easily handle auth and cache middleware and
		//		 to only handle route that we need for Belug-Apps
		r := mux.NewRouter()
		r.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(http.StatusUnauthorized) })
		r.MethodNotAllowedHandler = r.NotFoundHandler

		r.Use(
			func(handler http.Handler) http.Handler { return handlers.CombinedLoggingHandler(os.Stdout, handler) },
			CacheMiddleware(CacheMaxAge, CacheSize),
			NoCompressionMiddleware,
		)

		// NOTE: here is where all required paths are allowed
		truenasRouter := r.PathPrefix("/truenas/").Subrouter()
		truenasRouter.Use(
			TrimPathPrefixMiddleware("/truenas"),
			TruenasAuthMiddleware(truenasToken),
		)
		truenasRouter.Methods(http.MethodGet).
			Path("/api/v2.0/pool").
			HandlerFunc(proxy.ServeHTTP)
		truenasRouter.Methods(http.MethodGet).
			Path("/api/v2.0/pool/dataset").
			HandlerFunc(proxy.ServeHTTP)
		truenasRouter.Methods(http.MethodPost).
			Path("/api/v2.0/filesystem/listdir").
			HandlerFunc(proxy.ServeHTTP)

		log.Info(fmt.Sprintf("start API on %s", ctx.String("listen.addr")))
		return http.ListenAndServe(ctx.String("listen.addr"), r)
	}
}
