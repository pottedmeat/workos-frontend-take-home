import { Container, Theme } from '@radix-ui/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';
import { Directory } from './components/screens/Directory';

import '@radix-ui/themes/styles.css';

const queryClient = new QueryClient()

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <Theme>
                <Container size="3" my="7" mx="8px">
                    <Directory />
                </Container>
            </Theme>
        </QueryClientProvider>
    )
}

const rootElement = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(rootElement).render(<App />)