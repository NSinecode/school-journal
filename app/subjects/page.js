"use client";
import { useState, useEffect } from "react";
import { getSubjectsAction, deleteSubjectAction, updateSubjectAction } from '@/actions/subjects-actions';

export default function Forum() {
    const [subjectsNotConfirmed, setSubjectsNotConfirmed] = useState([]);
    const [subjectConfirmed, setSubjectsConfirmed] = useState([]);

    useEffect(() => {
        async function loadSubjects() {
            const result = await getSubjectsAction();
            if (result.status === 'success' && result.data) {
                setSubjectsConfirmed(result.data?.filter(subject => subject.is_confirmed));
                setSubjectsNotConfirmed(result.data?.filter(subject => !subject.is_confirmed));
            }
        }
        loadSubjects()
    }, [])

    const handleDeleteSubject = async(id, isConfirmed) => {
        if (isConfirmed) {
            setSubjectsConfirmed(subjectConfirmed.filter(subject => subject.id != id));
            await deleteSubjectAction(id);
        } else {
            setSubjectsNotConfirmed(subjectsNotConfirmed.filter(subject => subject.id != id));
            await deleteSubjectAction(id);
        }
    }
    const handleConfrimSuject = async(id) => {
        const subject = subjectsNotConfirmed.find(subject => subject.id === id);
        setSubjectsNotConfirmed(subjectsNotConfirmed.filter(subject => subject.id != id));
        setSubjectsConfirmed([...subjectConfirmed, subject]);
        await updateSubjectAction(id, {is_confirmed: true});
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            {subjectsNotConfirmed.length > 0 ? (
                <div>
                    <div>
                        <h1 className="text-3xl font-bold font-sans opacity-80">Новые заявки</h1>
                    </div>
                    <div className="mb-3">
                        {subjectsNotConfirmed.map(subject => (
                            <div
                              key={subject.id}
                              className="flex gap-2"
                            >
                                <p className="w-1/4 bg-yellow-400 mt-2 p-2 bg-opacity-80 rounded-xl border-2 border-yellow-400">{subject.name}</p>
                                <button
                                  className="mt-2 p-2 bg-green-500 bg-opacity-60 rounded-xl border-2 border-green-600 hover:bg-opacity-50" 
                                  onClick={() => handleConfrimSuject(subject.id)}
                                >
                                    Одобрить
                                </button>
                                <button
                                  className="mt-2 p-2 bg-red-500 bg-opacity-60 rounded-xl border-2 border-red-600 hover:bg-opacity-50"
                                  onClick={() => handleDeleteSubject(subject.id, false)}
                                >
                                    Отменить
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
            <div>
                <h1 className="text-3xl font-bold font-sans opacity-80">Подтвержденные предметы</h1>
                {subjectConfirmed.map(subject => (
                    <div
                      key={subject.id}
                      className="flex gap-2"
                    >
                        <p className="w-1/4 bg-blue-500 mt-2 p-2 bg-opacity-60 rounded-xl border-2 border-blue-500">{subject.name}</p>
                        <button
                          className="mt-2 p-2 bg-red-500 bg-opacity-60 rounded-xl border-2 border-red-600 hover:bg-opacity-50"
                          onClick={() => handleDeleteSubject(subject.id, true)}
                        >
                            Удалить
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}