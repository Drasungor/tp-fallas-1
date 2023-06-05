import React from 'react';
import './App.css';
import {Box, Button, Card, CardContent, CardHeader, Grid, Typography} from "@mui/material";

function App() {
    return (
        <Grid container>
            <Box component={Grid}
                 item xs={12}
                 height={500}
                 sx={{ opacity: 0.7, zIndex: 0, background: 'url(/images/fondo.jpg) center top / cover transparent' }}
            />
            <Grid item xs={12} container pr={2} pl={2} justifyContent={'center'} mt={-50} zIndex={1}>
                <Typography
                    mb={5}
                    sx={{
                        fontSize: '3rem',
                        fontWeight: 700,
                        color: '#FFFFFF'
                    }}
                >Prevención Influenza Aviar</Typography>
                <Card sx={{ width: '90%', minHeight: 500 }}>
                    <CardHeader title={"Medida de prevención de influenza aviar"}
                                subheader={"A continuación indique sus características para poder determinar la medida de prevención contra la influenza aviar más adecuada a usted"}
                    />
                    
                    <CardContent>
                        <Button variant={'contained'}>Botón Principal</Button>
                    </CardContent>
                </Card>
            </Grid>
      </Grid>
  )
}

export default App;
