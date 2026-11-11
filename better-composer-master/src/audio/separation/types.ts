type Stem = "original" | "vocals" | "lead" | "backing" | "instrumental";

type SeparationStatus = "idle" | "downloading" | "processing" | "ready" | "error" | "cancelled";

interface SeparationError {
  code:
    | "no-base-url"
    | "fetch-failed"
    | "integrity-mismatch"
    | "decode-failed"
    | "ort-failed"
    | "cancelled"
    | "unknown";
  message: string;
}

export type { SeparationError, SeparationStatus, Stem };
