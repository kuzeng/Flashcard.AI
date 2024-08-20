'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Box, CircularProgress, Container, Typography } from "@mui/material";

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!sessionId) {
        return;
      }

      try {
        const response = await fetch(`/api/checkout_session?session_id=${sessionId}`)
        const sessionData = await response.json();
        if (response.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCheckoutSession();
  }, [sessionId]);

  if (loading) {
    return (
      <Container
        maxWidth="100vw"
        sx={{
          textAlign: "center",
          mt: 4,
        }}
      >
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container
        maxWidth="100vw"
        sx={{
          textAlign: "center",
          mt: 4,
        }}
      >
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    )
  }

  return (
    <Container
      maxWidth="100vw"
      sx={{
        textAlign: "center",
        mt: 4,
      }}
    >
      {session.payment_status === 'paid' ? (
        <>
          <Typography variant="h4">Payment successful!</Typography>
          <Box sx={{ mt: 22 }}>
            <Typography variant="h6">Session ID: {session_id}</Typography>
            <Typography variant="body1">
              We have received your payment. You will receive an email confirmation shortly.
            </Typography>
          </Box>
        </>
      ) : (
        <>
        <Typography variant="h6">Payment failed.</Typography>
        <Box sx={{ mt: 10 }}>
          <Typography variant="body1">
            Your payment was not successful. Please try again.
          </Typography>
        </Box>
      </>
      )}
    </Container>
  )
}

export default ResultPage;