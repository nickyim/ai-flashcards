"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Button,
  Grid,
  ThemeProvider,
  createTheme,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  AppBar,
  Toolbar,
  Stack,
  Fade,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

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

// Custom Previous Arrow Component
const PreviousArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowBackIosIcon
      className={className}
      style={{
        ...style,
        display: "block",
        color: theme.palette.primary.main,
        fontSize: "2rem",
        zIndex: 1,
      }}
      onClick={onClick}
    />
  );
};

// Custom Next Arrow Component
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowForwardIosIcon
      className={className}
      style={{
        ...style,
        display: "block",
        color: theme.palette.primary.main,
        fontSize: "2rem",
        zIndex: 1,
      }}
      onClick={onClick}
    />
  );
};

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [viewMode, setViewMode] = useState("default");

  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const router = useRouter();

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFadeIn(true);
    }
  }, []);

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) {
        return;
      }
      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);
      const flashcards = [];

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PreviousArrow />,
    nextArrow: <NextArrow />,
    adaptiveHeight: true,
  };

  const handleGoHome = () => {
    router.push("/welcome");
  };

  const handleBackToCollection = () => {
    router.push("/flashcards");
  };

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background: "linear-gradient(to bottom, #eaf4f4, #a9d6e5)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          mt: 6,
          flexGrow: 1,
        }}
      >
        <AppBar position="fixed" sx={{ background: "primary.main" }}>
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
              <Stack direction="row" spacing={2}>
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
                <UserButton />
              </Stack>
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Fade in={fadeIn} timeout={1000}>
          <Container maxWidth="md">
            <Typography
              variant="h4"
              color="primary.main"
              fontWeight="bold"
              textAlign="center"
              mb={4}
            >
              Flashcard Set: {search}
            </Typography>

            {viewMode === "default" && (
              <>
                {/* Carousel Section */}
                <Slider {...settings}>
                  {flashcards.map((flashcard, index) => (
                    <Box key={index} sx={{ outline: "none" }}>
                      <Card sx={{ width: "60%", margin: "0 auto" }}>
                        <CardActionArea onClick={() => handleCardClick(index)}>
                          <CardContent>
                            <Box
                              sx={{
                                perspective: "1500px",
                                "& > div": {
                                  transition: "transform 0.6s",
                                  transformStyle: "preserve-3d",
                                  position: "relative",
                                  width: "100%",
                                  height: "200px",
                                  backfaceVisibility: "hidden",
                                  transform: flipped[index]
                                    ? "rotateX(180deg)"
                                    : "rotateX(0deg)",
                                  boxShadow: flipped[index]
                                    ? "0px 4px 20px rgba(0, 0, 0, 0.2)"
                                    : "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                },
                                "& > div > div": {
                                  position: "absolute",
                                  width: "100%",
                                  height: "100%",
                                  backfaceVisibility: "hidden",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: 2,
                                  boxSizing: "border-box",
                                  borderRadius: "4px",
                                },
                                "& > div > div:nth-of-type(1)": {
                                  transform: "rotateX(0deg)",
                                  boxShadow:
                                    "inset 0px 0px 5px rgba(0, 0, 0, 0.1)",
                                },
                                "& > div > div:nth-of-type(2)": {
                                  transform: "rotateX(180deg)",
                                  boxShadow:
                                    "inset 0px 0px 5px rgba(0, 0, 0, 0.1)",
                                },
                              }}
                            >
                              <div>
                                <div>
                                  <Typography variant="h6" color="primary.main">
                                    {flashcard.front}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography variant="h6" color="primary.main">
                                    {flashcard.back}
                                  </Typography>
                                </div>
                              </div>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Box>
                  ))}
                </Slider>
                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBackToCollection}
                  >
                    Back to Collection
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setViewMode("grid")}
                  >
                    Grid View
                  </Button>
                </Stack>

                {/* Table Section */}
                <Box sx={{ mt: 6 }}>
                  <Typography
                    variant="h5"
                    color="primary.main"
                    fontWeight="bold"
                    mb={2}
                  >
                    Flashcards in this Set
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="flashcard table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography fontWeight="bold" color="primary.main">
                              Question
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold" color="primary.main">
                              Answer
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {flashcards.map((flashcard) => (
                          <TableRow key={flashcard.id}>
                            <TableCell>{flashcard.front}</TableCell>
                            <TableCell>{flashcard.back}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </>
            )}

            {viewMode === "grid" && (
              <>
                {/* Grid View (flipping cards) */}
                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setViewMode("default")}
                  >
                    Back to Default View
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleBackToCollection}
                  >
                    Back to Collection
                  </Button>
                </Stack>

                <Grid container spacing={2} sx={{ mt: 4 }}>
                  {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card>
                        <CardActionArea onClick={() => handleCardClick(index)}>
                          <CardContent>
                            <Box
                              sx={{
                                perspective: "1500px",
                                "& > div": {
                                  transition: "transform 0.6s",
                                  transformStyle: "preserve-3d",
                                  position: "relative",
                                  width: "100%",
                                  height: "200px",
                                  backfaceVisibility: "hidden",
                                  transform: flipped[index]
                                    ? "rotateX(180deg)"
                                    : "rotateX(0deg)",
                                  boxShadow: flipped[index]
                                    ? "0px 4px 20px rgba(0, 0, 0, 0.2)"
                                    : "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                },
                                "& > div > div": {
                                  position: "absolute",
                                  width: "100%",
                                  height: "100%",
                                  backfaceVisibility: "hidden",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: 2,
                                  boxSizing: "border-box",
                                  borderRadius: "4px",
                                },
                                "& > div > div:nth-of-type(1)": {
                                  transform: "rotateX(0deg)",
                                  boxShadow:
                                    "inset 0px 0px 5px rgba(0, 0, 0, 0.1)",
                                },
                                "& > div > div:nth-of-type(2)": {
                                  transform: "rotateX(180deg)",
                                  boxShadow:
                                    "inset 0px 0px 5px rgba(0, 0, 0, 0.1)",
                                },
                              }}
                            >
                              <div>
                                <div>
                                  <Typography variant="h6" color="primary.main">
                                    {flashcard.front}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography variant="h6" color="primary.main">
                                    {flashcard.back}
                                  </Typography>
                                </div>
                              </div>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Container>
        </Fade>
      </Box>
    </ThemeProvider>
  );
}
