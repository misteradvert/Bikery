import React from 'react';
import { Box, Typography } from '@mui/material';
// import '../../../src/fonts/DischargePro.ttf'

export default function MainPage(): JSX.Element {
  return (
    <Box
      sx={{
        backgroundImage: `url('../src/img/main_page.jpeg')`,
        filter: 'brightness(85%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Центрирует содержимое по вертикали
        alignItems: 'center', // Центрирует содержимое по горизонтали
        textAlign: 'center', // Выравнивает текст по центру
        color: 'rgba(13, 13, 12, 1)',
        paddingBottom: '100px',
        // fontFamily: 'Discharge Pro',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '80%',
          color: 'rgba(33, 2, 2, 1)',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            width: '50%',
            fontSize: '22px',
            marginRight: '50px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '10px', // Округление углов
            padding: '10px', // Поля внутри прямоугольника
            // fontFamily: 'DischargePro',
          }}
        >
          Bikery - портал, где свобода не просто слово, а образ жизни. Здесь каждый может
          почувствовать настоящую скорость, ощутить дух движения и стать частью нашего сильного
          сообщества байкеров. Присоединяйтесь к нам!
        </Typography>
        <Box
          sx={{
            width: '50%',
            height: '80px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '10px', // Округление углов
            padding: '10px', // Поля внутри прямоугольника
            marginTop: '-75px', // Смещение вверх
            // animation: 'fadeInUp 3s ease'
          }}
        >
          <Typography className="text" variant="h5">
            <strong>Знать дорогу и проехать по ней - не одно и то же!</strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
