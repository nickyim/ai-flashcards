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
  Stack,
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
  typography: {
    fontFamily: "Roboto, sans-serif",
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 500,
    },
    body2: {
      fontSize: "1rem",
    },
  },
});

export default function welcomePage() {
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
    router.push("/generate");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleMyCollection = () => {
    router.push("/flashcards");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background: "linear-gradient(to bottom, #eaf4f4, #a9d6e5)",
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
              FlashAI
            </Typography>
            <SignedOut>
              <Button
                color="primary"
                onClick={handleGoHome}
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#b8d0eb",
                  borderRadius: 2,
                  width: "150px",
                  "&:hover": {
                    backgroundColor: "#a9d6e5",
                    transform: "translateY(-1px)",
                    boxShadow: 3,
                  },
                }}
              >
                Go Home
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
            <title>FlashAI</title>
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
              Thank you for choosing FlashAI!
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              color="text.secondary"
              className="fade-in-text"
            >
              Below you can find more information about our features and
              pricing. If you have any questions, do not hesitate to reach out!
            </Typography>
            <Stack
              direction="row"
              justifyContent="center"
              alignContent="center"
              spacing={5}
              mt={2}
            >
              <SignedOut>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  href="sign-in"
                  sx={{
                    mt: 2,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    color: "#f6fff8",
                    width: "200px",
                    "&:hover": {
                      backgroundColor: "#cce3de",
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                      color: "secondary.dark",
                      maxWidth: "200px",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  href="sign-up"
                  sx={{
                    mt: 2,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    color: "#f6fff8",
                    width: "200px",
                    "&:hover": {
                      backgroundColor: "#cce3de",
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                      color: "secondary.dark",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  SignUp
                </Button>
              </SignedOut>
              <SignedIn>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{
                    mt: 2,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    color: "#f6fff8",
                    "&:hover": {
                      backgroundColor: "#cce3de",
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                      color: "secondary.dark",
                    },
                    transition: "all 0.3s",
                  }}
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </SignedIn>
            </Stack>
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
                      boxShadow: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      backgroundColor: "white",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 3,
                        // cursor: "pointer",
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
                  price: "Free!",
                  content: "Basic features and limited storage.",
                  onClick: () => {},
                },
                {
                  title: "Pro",
                  price: "$7 / month",
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
                      boxShadow: 3,
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
