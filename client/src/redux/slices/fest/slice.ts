import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { FestType, FestsStateType } from '../../../types/fest';
import { addFestThunk, deleteFestThunk, editFestThunk, getAllFestsThunk } from './thunk';
import { addFestCommentThunk } from '../comments/festthunk';

const initialState: FestsStateType = {
  fests: [],
  selectedFest: null,
  modalType: null,
};

export const festsSlice = createSlice({
  name: 'fests',
  initialState,
  reducers: {
    setSelectedFestById: (state, action: PayloadAction<FestType['id']>) => {
      const selectedFest = state.fests.find((fest) => fest.id === action.payload);
      if (selectedFest) {
        state.selectedFest = selectedFest;
        state.modalType = 'info';
      }
    },
    openEditModal: (state, action: PayloadAction<FestType['id']>) => {
      const selectedFest = state.fests.find((fest) => fest.id === action.payload);
      if (selectedFest) {
        state.selectedFest = selectedFest;
        state.modalType = 'edit';
      }
    },
    clearSelectedFest: (state) => {
      state.selectedFest = null;
      state.modalType = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllFestsThunk.fulfilled, (state, action) => {
      state.fests = action.payload;
    });
    builder.addCase(addFestThunk.fulfilled, (state, action) => {
      state.fests.unshift(action.payload);
    });
    builder.addCase(deleteFestThunk.fulfilled, (state, action) => {
      if (!state.fests) return;
      state.fests = state.fests.filter((fest) => fest.id !== action.payload);
    });
    builder.addCase(editFestThunk.fulfilled, (state, action) => {
      if (!state.fests) return;
      state.fests = state.fests.map((fest) =>
        fest.id === action.payload.id ? action.payload : fest,
      );
    });
    builder.addCase(addFestCommentThunk.fulfilled, (state, action) => {
      const { festId, userId, text, User } = action.payload;
      const festToUpdate = state.fests.find((el) => el.id === festId);
      if (festToUpdate) {
        festToUpdate.CommentFests = [
          ...(festToUpdate.CommentFests || []),
          { text, userId, festId, User },
        ];
      }
    });
  },
});

export const { setSelectedFestById, clearSelectedFest } = festsSlice.actions;

export default festsSlice.reducer;
