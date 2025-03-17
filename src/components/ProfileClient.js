"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    if (!user) return;

    const syncUserWithDB = async () => {
      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ auth0Id: user.sub, email: user.email, name: user.name }),
        });

        if (res.ok) {
          const data = await res.json();
          setDbUser(data);
        } else {
          console.error("Failed to sync user:", await res.text());
        }
      } catch (err) {
        console.error("Error syncing user:", err);
      }
    };

    syncUserWithDB();
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    user && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{dbUser?.name || user.name}</h2>
        <p>{dbUser?.email || user.email}</p>
      </div>
    )
  );
}
