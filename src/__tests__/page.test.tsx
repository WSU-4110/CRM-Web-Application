import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { DashboardDemo } from '@/components/DashboardDemo'
import { AuthProvider } from '@/__mocks__/AuthProvider'


describe('Page', () => {
  it('renders a heading', () => {
    render( 
    <AuthProvider>
        <DashboardDemo  />
    </AuthProvider>
)

    const heading = screen.getByRole('heading', { level: 1 })

    expect(heading).toBeInTheDocument()
  })

  it('renders the word Dashboard', () => {
    render(
      <AuthProvider>
        <DashboardDemo />
      </AuthProvider>
    )

    const dashboardText = screen.getByText(/dashboard/i)
    expect(dashboardText).toBeInTheDocument()
  })
})