import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
  TextField,
} from '@mui/material';

const criteria = [
    { id: 1, name: 'Time Constraints: Does Timer Start at "Go"?', description: 'Does the level timer start counting down once the level begins ("Go" statement)? If No, then 0, if Yes then 1 point.' },
    { id: 2, name: 'Score for One Star', description: 'What is the minimum one star score? Add 1 point for every 100 hundred points needed to obtain one star.' },
    { id: 3, name: 'Dish Washer', description: 'Add 1 point if there is a dish washer.' },
    { id: 4, name: 'Number of Composite Challenges', description: 'Add 2 points for every composite challenge in the level.' },
    { id: 5, name: 'Composite Challenge Variations', description: 'Add 1 point for every composite challenge variation. Add an additional point for every variation that changes the number of atomic challenges required to complete.' },
    { id: 6, name: 'Fixed Obstacles', description: 'Add 1 point for every fixed obstacle (drop zones, being hit by car).' },
    { id: 7, name: 'Variable Obstacles', description: 'Add 1 point for every variable obstacle (falling, overcooking).' },
    { id: 8, name: 'Level Changes', description: 'Add 1 point for every environment change during the level playthrough. Add another point if the level change also changes tasking.' },
];

const ChallengeScorecard = () => {
    const [scores, setScores] = useState(criteria.reduce((acc, crit) => ({ ...acc, [crit.id]: 0 }), {}));
    const [totalScore, setTotalScore] = useState(0);

    useEffect(() => {
        const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
        setTotalScore(total);
    }, [scores]);

    const handleScoreChange = (valueAsString, valueAsNumber, id) => {
        setScores(prevScores => ({
            ...prevScores,
            [id]: valueAsNumber,
        }));
    };

    return (
        <Box sx={{ p: 5, maxWidth: '1200px', mx: 'auto' }}>
            <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
                Measuring Challenge
            </Typography>
            <Typography variant="h5" component="h3" sx={{ mt: 5, mb: 2 }}>
                What is Challenge in Video Games?
            </Typography>
            <Typography>
                Challenge is a game design concept in which level environments and task conditions are manipulated to elicit player effort. By embedding challenge principles into game design, player skills of key game mechanics are tested. Challenge can be expressed through various game elements, including but not limited too: 1) Amount of time to complete a level, 2) Success conditions, 3) Amount of tasks to complete a level, 4) Number of obstacles.
            </Typography>
            <Typography variant="h5" component="h3" sx={{ mt: 5, mb: 2 }}>
                How is Challenge used in Teams Research?
            </Typography>
            <Typography>
                Challenge in video game design paradigms can be leveraged by teams researchers as a respresentation of task load. Task Load and Challenge are both foundationally similar constructs: Environmental or Task conditions that affect user mental states and may affect performance. As a result, teams researchers can utilize video games as team research stimuli where challenge (or task load) is manipulated through the level design. This allows researchers the ability to use video games as a task environment for various team-related research questions such as manipulation of workload, team dynamics such as trust, team processes like communication, and the development of team level knowledge structures such as Transactive Memory Systems and Shared Mental Models.
            </Typography>
            <Typography variant="h5" component="h3" sx={{ mt: 5, mb: 2 }}>
                Challenge Scorecard
            </Typography>
            <TableContainer sx={{ mt: 4 }}>
                <Table>
                    <TableBody>
                        {criteria.map(crit => (
                            <TableRow key={crit.id}>
                                <TableCell>{crit.id}</TableCell>
                                <TableCell>{crit.name}</TableCell>
                                <TableCell>{crit.description}</TableCell>
                                <TableCell align="right">
                                    <TextField
                                        type="number"
                                        size="small"
                                        sx={{ width: '80px' }}
                                        value={scores[crit.id]}
                                        onChange={(e) => handleScoreChange(e.target.value, parseInt(e.target.value) || 0, crit.id)}
                                        inputProps={{ min: 0 }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3} sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                Total
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                {totalScore}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ChallengeScorecard;
