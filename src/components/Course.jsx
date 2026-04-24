const Course = ({ course }) => {

    const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
                    <div>
                            <h2>{course.name}</h2>
                            {course.parts.map(part =>
                                <p key={part.id}>
                                {part.name} {part.exercises}
                                </p>
                            )}
                            <b>total of {total} exercises </b>
                    </div>
           )
}
export default Course
//     <h1>{course.name}</h1>
//     {courses.parts.map(part =>
//     <p key={part.id}>{part.name} {part.exercises}</p>
//     )}
//     <b>total of {total} exercises </b>