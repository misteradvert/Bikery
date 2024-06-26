import React, { useEffect, useState } from 'react';
import { TextField, Box } from '@mui/material';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { editRaceThunk } from '../../redux/slices/race/thunk';

type EditRacesProps = {
  onSubmit?: () => void;
  onCancel?: () => void;
};

const boxStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
  border: '2px solid #000',
  boxShadow: 24,
  padding: '16px',
  width: '500px',
};

export default function EditRacesList({ onSubmit, onCancel }: EditRacesProps): JSX.Element {
  const dispatch = useAppDispatch();
  const selectedRace = useAppSelector((state) => state.motoRaces.selectedRaces);

  const [raceData, setRaceData] = useState({
    name: '',
    desc: '',
    image: '',
    length: 0,
    date: '',
  });

  useEffect(() => {
    if (selectedRace) setRaceData(selectedRace);
  }, [selectedRace]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setRaceData((prevData) => ({ ...prevData, [name]: value }));
  };

  const editHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const formData = {
      ...raceData,
      image: raceData.image,
    };

    if (!selectedRace) return;

    void dispatch(
      editRaceThunk({
        ...selectedRace,
        name: formData.name,
        desc: formData.desc,
        image: e.currentTarget.image.files[0],
        length: formData.length,
        date: formData.date,
      }),
    );
    onSubmit?.();
  };

  const handleCancel = (): void => {
    onCancel?.();
  };

  return (
    <Box component="form" sx={boxStyle} noValidate autoComplete="off" onSubmit={editHandler}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TextField
          name="name"
          required
          id="outlined-required"
          label="Название"
          placeholder="Название"
          value={raceData.name}
          onChange={handleChange}
          type="text"
          sx={{ marginBottom: '10px', width: '450px' }}
        />

        <TextField
          name="desc"
          required
          id="outlined-multiline-static"
          label="Описание"
          placeholder="Описание"
          multiline
          rows={6}
          sx={{ marginBottom: '10px', width: '450px' }}
          value={raceData.desc}
          onChange={handleChange}
        />

        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ marginBottom: '10px', width: '450px' }}
        >
          Добавить фото
          <Input type="file" name="image" sx={{ display: 'none' }} />
        </Button>

        <TextField
          name="length"
          required
          id="outlined-required"
          label="Длина"
          placeholder="Длина"
          value={raceData.length}
          onChange={handleChange}
          type="text"
          sx={{ marginBottom: '10px', width: '450px' }}
        />

        <TextField
          name="date"
          required
          id="outlined-required"
          label="Дата"
          placeholder="yyyy-mm-dd"
          value={raceData.date}
          onChange={handleChange}
          type="date"
          sx={{ marginBottom: '10px', width: '450px' }}
        />
        <Box>
          <Button
            style={{ margin: '15px', width: '150px' }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Изменить
          </Button>
          <Button
            style={{ margin: '15px', width: '150px' }}
            onClick={handleCancel}
            variant="contained"
            color="error"
          >
            Отменить
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
