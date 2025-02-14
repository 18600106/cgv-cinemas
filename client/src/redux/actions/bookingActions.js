import bookingApi from '../../api/bookingApi';

export const updateBookingAction = (seat, price) => async (dispatch, getState) => {
  let { seats, total } = getState().booking;

  if (seats.includes(seat)) {
    seats = seats.filter((item) => item !== seat);
    total -= price;
  } else {
    seats.push(seat);
    total += price;
  }

  dispatch({
    type: 'UPDATE_BOOKING',
    payload: { total, seats },
  });
};

export const createBookingAction = (data, history) => async (dispatch, getState) => {
  try {
    let { accessToken } = getState().auth;
    const { showtime, booking } = data;
    const body = {
      showtime_id: showtime.id,
      seats: booking.seats,
    };
    const response = await bookingApi.create(body, accessToken);
    if (!response.error) {
      dispatch({
        type: 'CREATE_BOOKING_SUCCESS',
        payload: response,
      });
      history.replace({ pathname: `/payment/${response.b_number}`, state: data });
    } else {
      dispatch({
        type: 'CREATE_BOOKING_FAIL',
        payload: response.error,
      });
    }
  } catch (error) {
    dispatch({
      type: 'CREATE_BOOKING_FAIL',
      payload:
        error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
