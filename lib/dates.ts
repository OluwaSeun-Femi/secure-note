export function formatLagos(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  });
}

// Inserts set created_at and updated_at in the same statement, so they only
// differ once a note has really been edited.
export function wasEdited(created: string, updated: string) {
  return new Date(updated).getTime() - new Date(created).getTime() > 2000;
}
