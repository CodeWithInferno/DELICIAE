"use client";

import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Hero from "@/components/Landing/Hero";

export default function Home() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const checkUserInDB = async () => {
      try {
        const res = await fetch("/api/user/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });

        if (res.status === 404) {
          await fetch("/api/user/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ auth0Id: user.sub, email: user.email, name: user.name }),
          });
        }
      } catch (err) {
        console.error("Error checking user:", err);
      }
    };

    checkUserInDB();
  }, [user]);

  return (
    <main className="w-screen h-screen overflow-hidden">
      <Hero />
    </main>
  );
}
