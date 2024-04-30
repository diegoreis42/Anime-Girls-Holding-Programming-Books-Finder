package open

import (
	"os/exec"
)

func Open(url string) {
	cmd := exec.Command("xdg-open", url)
	cmd.Run()
}
