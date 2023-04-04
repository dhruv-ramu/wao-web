import { Box, useDisclosure } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
// import Header from './components/Header';
import Header from './components/Menu';
import App from './pages';
import Signup from './pages/auth/signup';
import Login from './pages/auth/login';
import AskAQuestion from './pages/questions/ask';
import Question from './pages/questions/id';
import QuestionsPerSubject from './pages/questions/subject/name';
import SearchPage from './pages/search';
import QuestionsPerGrade from './pages/grade/grade';
import Dashboard from './pages/dashboard';
import { useEffect } from 'react';
import ScrollToTop from './components/ScrollToTop';

export default function RoutesConfig() {
  const { onOpen } = useDisclosure();
  return (
    <BrowserRouter>
      <Header
        onOpen={onOpen}
        logoText={'WAO'}
        brandText={'Home'}
        secondary={false}
        fixed={true}
      />
      <Box mt={10}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="auth">
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="questions">
            <Route path="ask" element={<AskAQuestion />} />
            <Route path=":slug" element={<Question />} />
          </Route>
          <Route path="subject">
            <Route path=":name" element={<QuestionsPerSubject />} />
          </Route>
          <Route path="/search" element={<SearchPage />} />
          <Route path="grade">
            <Route path=":grade" element={<QuestionsPerGrade />} />
          </Route>
          <Route path="dashboard" element={<Dashboard />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}
