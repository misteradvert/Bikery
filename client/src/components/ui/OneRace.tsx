import React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
// import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';

import type { RaceType } from '../../types/race';
import { deleteRaceThunk } from '../../redux/slices/race/thunk';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import Rate from './Rate';
import { setSelectedRacesById } from '../../redux/slices/race/slice';
import AddRaceComment from './AddRaceComment';
import OneRaceComment from './OneRaceComment';

type OneRaceProps = {
  race: RaceType;
};

export default function OneRace({ race }: OneRaceProps): JSX.Element {
  const user = useAppSelector((state) => state.auth.user);
  const commentsForRace = race.CommentRaces || [];
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = (): void => {
    setExpanded(!expanded);
  };

  const formattedDate = new Date(race.date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const dispatch = useAppDispatch();

  const deleteHandler = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    void dispatch(deleteRaceThunk(race.id));
  };

  return (
    <Card
      className="one_race_card"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        transition: '0.6s ease-in',
        '&:hover': {},
        '&::before': {
          content: '""',
          position: 'absolute',
          zIndex: '-1',
          top: '-15px',
          background: 'transparent', // Прозрачный цвет, чтобы не было видно перед карточкой
          height: '220px',
          width: '25px',
          transform: 'scale(1)',
          transformOrigin: '50% 50%',
          transition: 'transform 0.15s ease-out',
        },
        '&:hover::before': {
          transitionDelay: '0.2s',
          transform: 'scale(40)',
          background: '#f66d52', // Цвет, который будет заполнять всю карточку
        },
      }}
    >
      <CardHeader title={race.name} />
      <CardMedia
        className="race_img"
        component="img"
        height="200"
        image={`${import.meta.env.VITE_APP_TITLE}/img/race/${race.image}`}
        alt=""
      />

      <Rate rates={race.RaceRatings} race={race} />
      <CardContent>
        <Typography variant="subtitle1" sx={{ marginBottom: '10px' }}>
          Дата старта: {formattedDate}
        </Typography>
        <Typography variant="subtitle2" sx={{ marginBottom: '10px' }}>
          Длина маршрута: {race.length} км
        </Typography>
        <Typography variant="subtitle2">{race.desc}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        {user.isAdmin === true && (
          <>
            <Button
              className="delete_btn"
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={deleteHandler}
            >
              Удалить
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<BorderColorRoundedIcon />}
              onClick={() => dispatch(setSelectedRacesById(race.id))}
            >
              Изменить
            </Button>
          </>
        )}
        <IconButton
          className="more_button"
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          {expanded ? 'Скрыть' : 'Комментарии'}
        </IconButton>
      </CardActions>
      {expanded && (
        <CardContent>
          <Typography
            paragraph
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '5px',
              wordWrap: 'break-word',
            }}
          >
            {commentsForRace.map((comment) => (
              <OneRaceComment key={comment.id} comment={comment} />
            ))}
            {user.status === 'logged' && <AddRaceComment race={race} />}
          </Typography>
        </CardContent>
      )}
    </Card>
  );
}
