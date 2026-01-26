import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

export default function GoogleButton({ onGoogleAuth }) {
  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const idToken = credentialResponse?.credential;
          if (!idToken) {
            toast.error("Google sign-in did not return a token");
            return;
          }
          onGoogleAuth(idToken);
        }}
        onError={() => toast.error("Google sign-in failed")}
        useOneTap={false}
      />
    </div>
  );
}