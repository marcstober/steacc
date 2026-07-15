#include <errno.h>
#include <stdio.h>

#if defined(_WIN32)
#include <windows.h>
#else
#include <time.h>
#endif

/*
 * TODO(security): Add an optional max input byte limit to avoid very long-running
 * processing when stdin is extremely large.
 */

static void sleep_ms(long ms) {
  if (ms <= 0) {
    return;
  }

#if defined(_WIN32)
  Sleep((DWORD)ms);
#else
  struct timespec req;
  req.tv_sec = ms / 1000;
  req.tv_nsec = (ms % 1000) * 1000000L;
  while (nanosleep(&req, &req) == -1 && errno == EINTR) {
  }
#endif
}

int main(void) {
  long char_delay_ms = 25;
  long newline_delay_ms = 300;

  int ch;

  while ((ch = fgetc(stdin)) != EOF) {
    if (fputc(ch, stdout) == EOF) {
      fprintf(stderr, "Failed to write to stdout.\n");
      return 1;
    }

    fflush(stdout);
    sleep_ms(char_delay_ms);

    if (ch == '\n') {
      sleep_ms(newline_delay_ms);
    }
  }

  if (ferror(stdin)) {
    fprintf(stderr, "Failed to read from stdin.\n");
    return 1;
  }

  return 0;
}
