import React from 'react'
import ReactDOM from 'react-dom/client'
import { Container, Tabs, Theme } from "@radix-ui/themes";

import "@radix-ui/themes/styles.css";

export default function App() {
    return (
        <Theme>
            <Container size="3" my="7" mx="8px">
                <Tabs.Root defaultValue="users" mx="15px" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                    <Tabs.List>
                        <Tabs.Trigger value="users">Users</Tabs.Trigger>
                        <Tabs.Trigger value="roles">Roles</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="users">
                        <p>Users</p>
                    </Tabs.Content>
                    <Tabs.Content value="roles">
                        <p>Roles</p>
                    </Tabs.Content>
                </Tabs.Root>
            </Container>
        </Theme>
    )
}

const rootElement = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(rootElement).render(<App />)