import React, { ReactNode } from 'react';
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from '@mui/material/styles'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
    palette: {        
        background: {
            default: "rgb(240, 242, 245)"
        }
    },

    typography: {
        fontFamily: [
            'Roboto Slab',
            'sans-serif'
        ].join(',')
    },

    components: {
                
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    background: 'linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))',
                    padding: '0.375rem 1rem',
                    fontSize: '0.75rem',
                    fontWeight: 700, 
                    borderRadius: '0.5rem',
                    '&:hover': {
                        backgroundColor: 'rgb(255, 255, 255)', 
                        boxShadow: 'rgba(26, 115, 232, 0.4) 0rem 0.875rem 1.625rem -0.75rem, rgba(26, 115, 232, 0.15) 0rem 0.25rem 1.4375rem 0rem, rgba(26, 115, 232, 0.2) 0rem 0.5rem 0.625rem -0.3125rem'
                    }
                }
            }
        },
        
        MuiCard: {
            styleOverrides: {
                root: {
                    /*border: 0,
                    boxShadow: '0px 10px 35px 0px rgb(56 71 109 / 8%)',
                    backgroundColor: 'white',*/
                    boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem',
                    borderRadius: '0.75rem',
                    letterSpacing: '0.02857em'
                }
            }
        },

        MuiCardHeader: {
            styleOverrides: {
                root: {
                    padding: '1.25rem 2.25rem 0 2.25rem',
                    marginBottom: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    flexWrap: 'wrap',
                    minHeight: '70px',
                },
                title: {
                    fontSize: 'calc(1.26rem + .12vw)',
                    paddingTop: '0.5rem',
                    fontWeight: 600,
                    color: 'rgb(52, 71, 103)',
                    lineHeight: 1.2,
                    marginTop: 0
                },
                subheader: {
                    fontSize: '0.85rem',
                    fontWeight: 400,
                    color: 'rgb(123, 128, 154)'
                }
            }
        },
    }
});

interface ThemeProps{
    children?: ReactNode;
}

export function Theme (props: ThemeProps) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            { props.children }
        </ThemeProvider>
    );
}