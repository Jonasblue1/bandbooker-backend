import { Route, Router } from 'wouter';
import Home from './routes/Home';
import BandProfile from './routes/BandProfile';
import VenueDashboard from './routes/VenueDashboard';
import BookingForm from './routes/BookingForm';

export const App = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/band/:id" component={BandProfile} />
      <Route path="/venue" component={VenueDashboard} />
      <Route path="/book/:bandId" component={BookingForm} />
    </Router>
  );
};
