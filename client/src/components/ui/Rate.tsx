// import React from 'react';
import * as React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import type { RaceType } from '../../types/race';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addRatingThunk } from '../../redux/slices/race/thunk';
import type { SetRating } from '../../types/rating';

const labels: { [index: string]: string } = {
  1: 'Useless',
  2: 'Poor',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent',
};

type RatePropsType = {
  race: RaceType;
  rates: SetRating[];
};

function getLabelText(value: number): string {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

export default function Rate({ race, rates }: RatePropsType): JSX.Element {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [value, setValue] = React.useState<number>(0);

  const hasVoted =
    !user.isAdmin && user.status === 'logged' && rates.some((rate) => rate.userId === user.id);

  const totalRating = rates.reduce((acc, el) => acc + el.starsCount, 0);
  const averageRating = rates.length > 0 ? totalRating / rates.length : 0;

  React.useEffect(() => {
    setValue(averageRating);
  }, [averageRating]);

  const rateHandler = (rating: null | number): void => {
    if (!hasVoted && !user.isAdmin && user.status === 'logged') {
      void dispatch(addRatingThunk({ userId: user.id, raceId: race.id, starsCount: rating ?? 0 }));
      setValue(averageRating);
    } else {
      alert('Вы уже проголосовали за эту гонку. Голосование доступно только один раз');
    }
  };

  const [hover, setHover] = React.useState(-1);
  return (
    <Box
      sx={{
        width: 200,
        display: 'flex',
        alignItems: 'center',
        marginLeft: '12px',
      }}
    >
      <Rating
        name="hover-feedback"
        value={value}
        precision={0.5}
        getLabelText={getLabelText}
        onChange={(_e, rating) => rateHandler(rating)}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        readOnly={hasVoted}
        emptyIcon={<StarIcon style={{ opacity: 0.6 }} fontSize="inherit" />}
      />
      {value !== null && <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>}
    </Box>
  );
}
