"use client";
import { useState, useEffect } from "react";
import { getSubjectsAction, deleteSubjectAction, updateSubjectAction, createSubjectAction } from '@/actions/subjects-actions';

export default function Forum() {
    const [subjectsNotConfirmed, setSubjectsNotConfirmed] = useState([]);
    const [subjectConfirmed, setSubjectsConfirmed] = useState([]);
    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const [newSubject, setNewSubject] = useState("");
    const [isSubError, setIsSubError] = useState(false);
    const [shake, setShake] = useState(false);

    const handleSubjectRequest = async () => {
        if (newSubject.trim() == "" || subjectConfirmed.find(subject => subject.name == newSubject)) {
          setIsSubError(true);
          setShake(true);
          setTimeout(() => setShake(false), 500); // Останавливаем тряску
          return;
        }
        const newSub = await createSubjectAction({name: newSubject, is_confirmed: true});
        setSubjectsConfirmed(prevSub => [...prevSub, newSub.data])
        setIsRequestOpen(false);
      }


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
                <div className="flex gap-8">
                    <h1 className="text-3xl font-bold font-sans opacity-80">Подтвержденные предметы</h1>
                    <button
                        className="mt-2 bg-green-500 bg-opacity-60 rounded-xl border-2 border-green-600 hover:bg-opacity-50 px-1"
                        onClick={() => setIsRequestOpen(true)}
                    >
                        Новый предмет
                    </button>
                </div>
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
            {isRequestOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div
                    className={`bg-gray-800 p-6 w-[400px] rounded-lg shadow-lg transition-transform ${
                    shake ? "animate-shake" : ""
                    }`}
                >
                    <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => {
                        setNewSubject(e.target.value);
                        setIsSubError(false);
                    }}
                    className={`w-full p-2 border rounded ${
                        isSubError ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Введите название предмета"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setIsRequestOpen(false)} className="px-4 py-2 bg-gray-700 rounded">
                        Отменить
                    </button>
                    <button onClick={handleSubjectRequest} className="px-4 py-2 bg-blue-500 disabled:opacity-50 text-white rounded">
                        Добавить
                    </button>
                    </div>
                </div>
                </div>
            )}
            <link rel="stylesheet" href="/Courses/style.css" />
        </div>
        
    );
}