"use client";

import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import {
  Container,
  Toolbar,
  Typography,
  Button,
  AppBar,
  Box,
  Grid,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6200EA",
    },
    secondary: {
      main: "#00BFA5",
    },
    background: {
      default: "#F5F5F5",
    },
  },
});

export default function Home() {
  const router = useRouter();

  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  const handleGetStarted = () => {
    router.push('/generate');
  }  
  
  const handleMyCollection = () => {
    router.push('/flashcards');
  }  


  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: "background.default",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >

        <AppBar position="static" sx={{ background: "primary.main" }}>
          <Toolbar variant="dense">
            <Typography
              variant="h6"
              style={{ flexGrow: 1, fontWeight: "bold" }}
            >
              AI Flashcards
            </Typography>
            <SignedOut>
              <Button
                color="inherit"
                href="sign-in"
                sx={{
                  mx: 1,
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                href="sign-up"
                sx={{
                  mx: 1,
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            // justifyContent: "space-between",
            py: 2,
            gap: 9,
          }}
        >
          <Head>
            <title>AI Flashcards</title>
            <meta
              name="description"
              content="Create flashcard from your text"
            />
          </Head>

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography
              variant="h3"
              gutterBottom
              fontWeight="bold"
              color="primary.main"
            >
              Welcome to AI Flashcards
            </Typography>
            <Typography variant="h6" gutterBottom color="text.secondary">
              The easiest way to make flashcards from your text
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                mt: 2,
                px: 3,
                py: 1,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "secondary.dark",
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                },
                transition: "all 0.3s",
              }}
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h4"
              gutterBottom
              textAlign="center"
              color="primary.main"
              fontWeight="bold"
            >
              Features
            </Typography>
            <Grid container spacing={2}>
              {[
                {
                  title: "Easy Text Input",
                  content:
                    "Simply input your text and let our software do the rest.",
                },
                {
                  title: "Smart Flashcards",
                  content:
                    "Our AI intelligently breaks down your text into concise flashcards.",
                },
                {
                  title: "Accessible Anywhere",
                  content:
                    "Access your flashcards from any device, at any time.",
                },
              ].map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      boxShadow: 1,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      backgroundColor: "white",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 3,
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      color="secondary.main"
                      fontWeight="bold"
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2">{feature.content}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              gutterBottom
              color="primary.main"
              fontWeight="bold"
            >
              Pricing
            </Typography>
            <Grid container spacing={2}>
              {[
                {
                  title: "Basic",
                  price: "$5 / month",
                  content: "Basic features and limited storage.",
                  onClick: () => {},
                },
                {
                  title: "Pro",
                  price: "$10 / month",
                  content:
                    "Unlimited flashcards and storage, with priority support.",
                  onClick: handleSubmit,
                },
              ].map((plan, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      boxShadow: 1,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      backgroundColor: "white",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: 3,
                      },
                    }}
                  >
                    <div>
                      <Typography
                        variant="h5"
                        gutterBottom
                        color="primary.main"
                        fontWeight="bold"
                      >
                        {plan.title}
                      </Typography>
                      <Typography
                        variant="h6"
                        gutterBottom
                        color="secondary.main"
                      >
                        {plan.price}
                      </Typography>
                      <Typography variant="body2">{plan.content}</Typography>
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{
                        mt: 2,
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      }}
                      onClick={plan.onClick}
                    >
                      Choose {plan.title}
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
