package main

import (
	"encoding/json"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"regexp"
	"strings"

	"github.com/joevtap/Anime-Girls-Holding-Programming-Books-Finder/go/open"
)

const (
	baseUrl = "https://api.github.com/repos/cat-milk/Anime-Girls-Holding-Programming-Books/contents"
)

type Images []struct {
	Url string `json:"download_url"`
}

func toTitle(s string) string {
	fletter := strings.ToTitle(s[:1])
	rest := s[1:]
	return strings.Join([]string{fletter, rest}, "")
}

func main() {
	if len(os.Args) < 2 {
		log.Fatalln("Missing argument")
	}

	lang := os.Args[1]

	res, err := http.Get(strings.Join([]string{baseUrl, toTitle(lang)}, "/"))

	if err != nil {
		log.Fatalln(err)
	}

	if res.StatusCode != 200 {
		log.Fatalln("Not found")
	}

	body, err := io.ReadAll(res.Body)

	if err != nil {
		log.Fatalln(err)
	}

	imgs := Images{}

	if err := json.Unmarshal(body, &imgs); err != nil {
		log.Fatalln(err)
	}

	clen := len(imgs)
	i := rand.Intn(clen)

	imgex := regexp.MustCompile(`[\w\d\-_\/\.\:]*\.(jpg|jpeg|png|gif)`)

	if imgex.Match([]byte(imgs[i].Url)) {
		open.Open(imgs[i].Url)
	}
}
