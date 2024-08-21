"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Container, Fade } from "@mui/material";
import { writeBatch, doc, collection, getDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase";
import { SignedIn } from "@clerk/nextjs";

export default function ThankYou() {
  const router = useRouter();
  const { user } = useUser();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        router.push("/welcome");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFadeIn(true);
    }
  }, []);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (sessionId && user) {
      updateStatus();
    }
  }, [user]);

  const updateStatus = async () => {
    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      batch.set(userDocRef, { isPro: true }, { merge: true });
    }

    await batch.commit();
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #eaf4f4, #a9d6e5)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
      }}
    >
      <Fade in={fadeIn} timeout={1000}>
        <Container
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            color="primary.main"
            fontWeight="bold"
            mb={4}
          >
            Thank You for Your Purchase!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            You will be redirected back to the home page in a moment...
          </Typography>
        </Container>
      </Fade>
    </Box>
  );
}
