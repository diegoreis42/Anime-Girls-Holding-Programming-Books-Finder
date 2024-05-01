package open

import (
	"os/exec"
)

func Open(url string) {
	cmd := exec.Command("open", url)
	cmd.Run()
}
