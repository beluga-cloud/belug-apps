package main

import (
	"bytes"
	"fmt"
	"hash/fnv"
	"io"
	"net/http"
	"net/http/httptest"
	"time"

	"github.com/gorilla/mux"
	lru "github.com/hashicorp/golang-lru"
)

// CacheMiddleware caches all requests that needs to be cached by the proxy (slow requests).
func CacheMiddleware(maxAge time.Duration, size int) mux.MiddlewareFunc {
	// NOTE: ARC cache is a simple but efficient cache for our usage
	log.Info(fmt.Sprintf("setup ARC cache (%d bytes)", size))
	cache, err := lru.NewARC(size)
	if err != nil {
		panic(err)
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			begin := time.Now()
			hash := fnv.New128a()
			_, _ = hash.Write([]byte(req.URL.String()))

			// NOTE: on POST request, we would like to use the body as key cache
			if req.Method == http.MethodPost {
				bodyBytes, _ := io.ReadAll(req.Body)
				_ = req.Body.Close()
				req.Body = io.NopCloser(bytes.NewReader(bodyBytes))
				_, _ = hash.Write(bodyBytes)
			}
			key := string(hash.Sum(nil))

			// NOTE: fetch and check if the request is already cached
			cached, exists := cache.Get(key)
			switch {
			case exists && begin.Sub(cached.(*HttpResponseEntry).hit) >= maxAge:
				cache.Remove(key)
			case exists:
				cached.(*HttpResponseEntry).hit = time.Now()
				_, _ = w.Write(cached.(*HttpResponseEntry).Body)
				for k, vs := range cached.(*HttpResponseEntry).Header {
					for _, v := range vs {
						w.Header().Add(k, v)
					}
				}
				return
			}

			recorder := httptest.NewRecorder()
			next.ServeHTTP(recorder, req)

			// NOTE: we cache responses only TrueNAS respond in more than 500ms
			if recorder.Code == http.StatusOK && time.Since(begin) > 500*time.Millisecond {
				cache.Add(key, &HttpResponseEntry{
					Header: recorder.Header(),
					Body:   recorder.Body.Bytes(),
					hit:    time.Now()},
				)
			}

			// NOTE: we copy all data from the recorder to the response
			w.WriteHeader(recorder.Code)
			_, _ = w.Write(recorder.Body.Bytes())
			for k, vs := range recorder.Header() {
				for _, v := range vs {
					w.Header().Add(k, v)
				}
			}
		})
	}
}

// TruenasAuthMiddleware authenticates all requests to the TrueNAS API
func TruenasAuthMiddleware(token string) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			req.Header.Set("Authorization", "Bearer "+token)
			next.ServeHTTP(w, req)
		})
	}
}
