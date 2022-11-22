FROM docker.io/library/golang:1.19.3-alpine3.15 as builder

WORKDIR /build/api-proxy
COPY . /build/api-proxy

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o api-proxy .


FROM scratch

WORKDIR /
COPY --from=builder /build/api-proxy/api-proxy .

USER 65534:65534
CMD ["./api-proxy"]
