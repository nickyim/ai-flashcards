'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Container } from '@mui/material';

export default function ThankYou() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/welcome');
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <Box 
            sx={{ 
                background: "linear-gradient(to bottom, #eaf4f4, #a9d6e5)", 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: 4 
            }}
        >
            <Container
                sx={{
                    textAlign: 'center',
                }}
            >
                <Typography variant="h3" color="primary.main" fontWeight="bold" mb={4}>
                    Thank You for Your Purchase!
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    You will be redirected back to the home page in a moment...
                </Typography>
            </Container>
        </Box>
    );
}
