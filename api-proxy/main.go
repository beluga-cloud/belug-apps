package main

import (
	"os"

	"github.com/urfave/cli/v2"
	"go.uber.org/zap"
)

func main() {
	log, _ := zap.NewProduction(zap.ErrorOutput(os.Stderr))
	if env, exists := os.LookupEnv("LOG_LEVEL"); exists {
		if level, err := zap.ParseAtomicLevel(env); err != nil {
			log.Error(err.Error())
		} else {
			log, _ = zap.NewProduction(zap.IncreaseLevel(level))
		}
	}
	defer log.Sync()

	app := &cli.App{
		Name:  "belug-apps API proxy",
		Usage: "TrueNAS API proxy with only required paths enabled, for security reason",
		Flags: []cli.Flag{
			&cli.StringFlag{Name: "listen.addr", Usage: "Address to listen on", Value: "localhost:8080", EnvVars: []string{"LISTEN_ADDR"}},
			&cli.StringFlag{Name: "truenas.url", Usage: "TrueNAS address", Required: true, EnvVars: []string{"TRUENAS_URL"}},
			&cli.StringFlag{Name: "truenas.token", Usage: "TrueNAS API token", Required: true, EnvVars: []string{"TRUENAS_TOKEN"}},
			&cli.BoolFlag{Name: "tls.insecure", Usage: "Allow insecure server connections", Value: false, EnvVars: []string{"TLS_INSECURE"}},
		},

		Action: ProxyAction(log),
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err.Error())
		os.Exit(1)
	}
}
