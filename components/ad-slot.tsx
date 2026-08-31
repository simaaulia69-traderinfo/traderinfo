type AdSlotProps = {
  variant?: "banner" | "header" | "in-article" | "sidebar" | "footer";
  className?: string;
};

export function AdSlot({ variant = "banner", className = "" }: AdSlotProps) {
  // Keep the slot component in the codebase for future AdSense activation,
  // but hide all placeholder boxes from the public UI until the publisher ID
  // is approved and ready to be published.
  return null;
}
