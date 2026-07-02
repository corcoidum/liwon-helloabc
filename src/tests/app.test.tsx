import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { ParentArea } from '../screens/ParentArea'
import { ListenChoose } from '../activities/ListenChoose'
import { defaultData } from '../services/storage'
import { markIntroduced, recordAnswer } from '../services/progress'

describe('App main flow', () => {
  it('shows all home actions', () => {
    render(<App />)
    expect(screen.getByTestId('home-screen')).toBeInTheDocument()
    for (const id of ['go-lesson', 'go-trace', 'go-match', 'go-sort', 'go-chant', 'go-review']) {
      expect(screen.getByTestId(id)).toBeInTheDocument()
    }
    expect(screen.getByTestId('parent-hold')).toBeInTheDocument()
  })

  it('starts the first lesson with letter A and advances to listening', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('go-lesson'))
    const intro = await screen.findByTestId('letter-intro')
    expect(intro).toHaveAttribute('data-letter', 'A')
    await user.click(screen.getByTestId('intro-next'))
    const listen = await screen.findByTestId('listen-choose')
    expect(listen).toHaveAttribute('data-answer', 'A')
    // introduction was persisted
    expect(localStorage.getItem('hello-abc-data-v1')).toContain('"introduced":true')
  })
})

describe('ListenChoose', () => {
  function setup(onAnswer: (c: boolean) => void, onNext = () => {}) {
    render(
      <ListenChoose
        letter="A"
        data={defaultData()}
        makeOptions={() => ['A', 'B']}
        onAnswer={onAnswer}
        onReplay={() => {}}
        onNext={onNext}
      />,
    )
  }

  it('praises the right answer and shows next', async () => {
    const user = userEvent.setup()
    const answers: boolean[] = []
    setup((c) => answers.push(c))
    await user.click(screen.getByRole('button', { name: /^Aa/ }))
    expect(answers).toEqual([true])
    expect(screen.getByTestId('listen-next')).toBeInTheDocument()
  })

  it('stays gentle on a wrong answer and allows retry', async () => {
    const user = userEvent.setup()
    const answers: boolean[] = []
    setup((c) => answers.push(c))
    await user.click(screen.getByRole('button', { name: /^Bb/ }))
    expect(answers).toEqual([false])
    expect(screen.queryByTestId('listen-next')).not.toBeInTheDocument()
    expect(screen.getByText(/괜찮아요/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^Aa/ }))
    expect(answers).toEqual([false, true])
  })
})

describe('ParentArea', () => {
  it('shows progress, difficult letters, and review items', () => {
    let data = defaultData()
    data = markIntroduced(data, 'A')
    data = markIntroduced(data, 'B')
    data = recordAnswer(data, 'A', false)
    data = recordAnswer(data, 'A', false)
    render(<ParentArea data={data} onSettings={() => {}} onReset={() => {}} onBack={() => {}} />)
    expect(screen.getByText(/전체 진도: 2 \/ 26/)).toBeInTheDocument()
    expect(screen.getByText(/A \(2회 틀림\)/)).toBeInTheDocument()
    const review = screen.getByTestId('parent-review')
    expect(review.textContent).toContain('A')
  })

  it('requires a second tap before resetting data', async () => {
    const user = userEvent.setup()
    let resets = 0
    render(
      <ParentArea
        data={defaultData()}
        onSettings={() => {}}
        onReset={() => {
          resets++
        }}
        onBack={() => {}}
      />,
    )
    await user.click(screen.getByTestId('reset-data'))
    expect(resets).toBe(0)
    await user.click(screen.getByTestId('reset-confirm'))
    expect(resets).toBe(1)
  })
})
