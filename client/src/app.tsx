import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import { useRoutes } from 'react-router-dom';
import Gnb from './components/gnb';
import { getClient } from './queryClient';
import { routes } from './routes';
import { RecoilRoot } from 'recoil';

const App = () => {
  const elem = useRoutes(routes);
  const queryClient = getClient();
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Gnb/>
        {elem}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;