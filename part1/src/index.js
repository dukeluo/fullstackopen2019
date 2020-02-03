import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    const Header = (props) => (<h1>{props.name}</h1>);
    const Part = (props) => (<p>{props.content.name} {props.content.exercises}</p>);
    const Content = (props) => (
        <>
            {props.parts.map((part, index) => <Part content={part} key={index} />)}
        </>
    );
    const Total = (props) => (<p>Number of exercises {props.count}</p>);

    const course = {
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10
            },
            {
                name: 'Using props to pass data',
                exercises: 7
            },
            {
                name: 'State of a component',
                exercises: 14
            }
        ]
    };

    return (
        <>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total count={course.parts.reduce((acc, part) => acc + part.exercises, 0)} />
        </>
    )
};

ReactDOM.render(<App />, document.getElementById('root'));