"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";


import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Button,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#676fgd",
      main: "#424769",
      dark: "#2d3250",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#AD81A7",
      main: "#6C5E82",
      dark: "#2E365A",
      contrastText: "#F8C19B",
    },
  },
});

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [matchMode, setMatchMode] = useState(false);
  const [highlighted, setHighlighted] = useState([]);
  const [hidden, setHidden] = useState([]);
  const [red, setRed] = useState([]);

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      const colRef = collection(doc(db, "users", user.id), search);
      const docSnap = await getDocs(colRef);
      let flashcards = [];

      docSnap.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });

      if (matchMode) {
        const doubleCards = flashcards.flatMap((flashcard) => [
          { ...flashcard, type: "front" },
          { ...flashcard, type: "back" },
        ]);
        setFlashcards(shuffleFlashcards(doubleCards));
      } else {
        setFlashcards(flashcards);
      }
    }

    getFlashcard();
  }, [user, search, matchMode]);

  // Create a function that shuffles the flashcards
  const shuffleFlashcards = (flashcards) => {
    const array = [...flashcards];
    let currentIndex = array.length;

    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleHighlightClick = (id) => {
    if (highlighted[id]) {
      setHighlighted((prev) => ({
        ...prev,
        [id]: false,
      }));
      return;
    }

    const highlightedIds = Object.keys(highlighted).filter(
      (key) => highlighted[key]
    );

    if (highlightedIds.length === 1) {
      const [first] = highlightedIds;
      const second = id;

      // Check if the highlighted cards match
      if (
        flashcards[first].type !== flashcards[second].type &&
        flashcards[first].front === flashcards[second].front
      ) {
        setMatched((prev) => ({
          ...prev,
          [first]: true,
          [second]: true,
        }));
        // Hide the matched cards
        setHidden((prev) => ({
          ...prev,
          [first]: true,
          [second]: true,
        }));

        setHighlighted({});

        // Check if all cards are matched
        if (Object.keys(matched).length + 2 === flashcards.length) {
          // Reset all matches and show all cards
          setTimeout(() => {
            setRed([]);
            setMatched([]);
            setHidden([]);
            setHighlighted([]);
            setFlashcards(shuffleFlashcards(flashcards));
          }, 1000);
        }
      } else {
        // Unhighlight both cards if they don't match
        setRed((prev) => ({
          ...prev,
          [first]: true,
          [second]: true,
        }));

        setTimeout(() => {
          setRed([]);
          setHighlighted({
            [first]: false,
            [second]: false,
          });
        }, 500);
      }
    } else {
      // Highlight the clicked card
      setHighlighted((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  const toggleMatchMode = () => {
    setMatchMode((prev) => !prev);
  };

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  if (matchMode) {
    return (
      <Container>

        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />

        <Typography
          variant="h2"
          component="h1"
          sx={{ mt: 4, textAlign: "center", position: "relative" }}
          gutterBottom
        >
          Match Flashcards
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  color: theme.palette.primary.main,
                  borderColor: highlighted[index]
                    ? theme.palette.secondary.light
                    : "white",
                  border: highlighted[index]
                    ? `5px solid ${theme.palette.secondary.main}`
                    : "none",
                  transition: "background-color 0.3s, border 0.3s",
                }}
              >
                <CardActionArea onClick={() => handleHighlightClick(index)}>
                  <CardContent>
                    <Box
                      sx={{
                        perspective: "1000px",
                        "& > div": {
                          position: "relative",
                          width: "100%",
                          height: "200px",
                          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                        },
                        "& > div > div": {
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 2,
                          boxSizing: "border-box",
                          backgroundColor: hidden[index]
                            ? "#90EE90"
                            : red[index]
                            ? "#FF6347"
                            : "white",
                        },
                      }}
                    >
                      <div>
                        <div>
                          <Typography variant="h5" component="div">
                            {flashcard.type === "front"
                              ? flashcard.front
                              : flashcard.back}
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
        <Button
          onClick={() => toggleMatchMode()}
          sx={{
            mt: 2,
            mr: 2,
            position: "flex",
            alignContent: "center",
            alignItems: "center",
            textAlign: "center",
            backgroundColor: theme.palette.secondary.contrastText,
            color: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.secondary.contrastText,
              color: theme.palette.primary.main,
            },
          }}
        >
          Back Page
        </Button>
        <Button
          onClick={() => setFlashcards(shuffleFlashcards(flashcards))}
          sx={{
            mt: 2,
            position: "flex",
            alignContent: "center",
            alignItems: "center",
            textAlign: "center",
            backgroundColor: theme.palette.secondary.contrastText,
            color: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.secondary.contrastText,
              color: theme.palette.primary.main,
            },
          }}
        >
          Shuffle
        </Button>
      </Container>
    );
  }

  return (
    <Container
    transition={{
      delay: 0.3,
      duration: 0.8,
      ease: "easeInOut",
    }}
    >

      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />


      <Typography
        variant="h2"
        component="h1"
        sx={{ mt: 4, textAlign: "center", position: "relative" }}
        gutterBottom
      >
        Generated Flashcard Preview
      </Typography>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ color: theme.palette.primary.main }}>
              <CardActionArea onClick={() => handleCardClick(index)}>
                <CardContent>
                  <Box
                    sx={{
                      perspective: "1000px",
                      "& > div": {
                        transition: "transform 0.6s",
                        transformStyle: "preserve-3d",
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                        transform: flipped[index]
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
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
                      },
                      "& > div > div:nth-of-type(2)": {
                        transform: "rotateY(180deg)",
                      },
                    }}
                  >
                    <div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.front}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h5" component="div">
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
      <Button
        href="/flashcards"
        sx={{
          mt: 2,
          position: "flex",
          alignContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: theme.palette.secondary.contrastText,
          color: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.secondary.contrastText,
            color: theme.palette.primary.main,
          },
        }}
      >
        Back Page
      </Button>
      <Button
        variant="contained"
        onClick={() => setMatchMode(true)}
        sx={{
          mt: 2,
          ml: 2,
          position: "flex",
          alignContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: theme.palette.secondary.contrastText,
          color: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.secondary.contrastText,
            color: theme.palette.primary.main,
          },
        }}
      >
        Match
      </Button>

    </Container>
  );
}