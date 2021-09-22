import React from 'react'
import {GuessData} from '../../../types/game-types'
import {Table, Button} from 'react-bootstrap'

interface GameResultProps {
    finalScore: number
    guessHistory: GuessData[]
    onPlayAgainPress: () => void
}

export const GameResult: React.FC<GameResultProps> = ({finalScore, guessHistory, onPlayAgainPress}) => {

    const renderRows = () => {
        return (
            guessHistory.map((guess, index) => {
                return (
                    <TableRow 
                        data={guess}
                        turnNum={index + 1}
                        key={guess.item.name}
                    />
                )
            })
        )
    }

    return (
        <div style={{flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div>
                <h2>Final Score: {finalScore}</h2>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Item</th>
                        <th>Guess</th>
                        <th>Actual</th>
                        <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderRows()}
                    </tbody>
                </Table>
            </div>
            <Button onClick={onPlayAgainPress} variant="primary">Play Again</Button>
        </div>
    )
}

const TableRow: React.FC<{data: GuessData, turnNum: number}> = ({data, turnNum}) => {

    const {item, guessPrice, score} = data

    return (
        <tr>
            <td>{turnNum}</td>
            <td>{item.name}</td>
            <td>{guessPrice}</td>
            <td>{item.salePrice}</td>
            <td>{score}</td>
        </tr>
    )
}