package open

import (
	"os/exec"
)

func Open(url string) {
	cmd := exec.Command("start", url)
	cmd.Run()
}
