/**
 * Get contextual greeting based on time of day
 */
export function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 13) {
    return {
      title: "Good morning",
      subtitle: "Your cozy corner is waiting for you.\nReady to dive into your next chapter?"
    };
  } else if (hour >= 13 && hour < 20) {
    return {
      title: "Good afternoon",
      subtitle: "Long day?\nYour sanctuary awaits."
    };
  } else {
    return {
      title: "Hey! Still up reading",
      subtitle: "No judging, enjoy."
    };
  }
}

/**
 * Get display name from user profile or email
 */
export function getDisplayName(displayName?: string | null, email?: string | null): string {
  if (displayName) {
    return displayName.split(" ")[0]; // First name only
  }
  
  if (email) {
    // Extract name from email (part before @)
    const emailName = email.split("@")[0];
    // Capitalize first letter
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }
  
  return "there";
}

