"use client"

import React, { useState, useRef } from 'react'

function InputImage() {
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [previewShow, setpreviewShow] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [result, setResult] = useState(null)
    const inputRef = useRef(null)

    const setImage = (imageFile) => {
        setFile(imageFile)
        setResult(null)
        setError(null)
        setPreview(imageFile ? {url: URL.createObjectURL(imageFile), size: imageFile.size, name: imageFile.name  } : null)
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const f = e.dataTransfer.files[0]
            if (f.type.startsWith('image/')) setImage(f)
        }
    }
    const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

    const handleDragOver = (e) => e.preventDefault()

    const handleSubmit = async () => {
        if (!file) {
            setError('Please select an image first.')
            return
        }

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const resp = await fetch('https://plant-disease-classifier-2-5ios.onrender.com/predict', {
                method: 'POST',
                body: formData,
            })

            if (!resp.ok) throw new Error(`Server error: ${resp.status}`)

            const data = await resp.json()
            setResult(data.top5);
            setpreviewShow(false)
            
            
            
        } catch (err) {
            console.error(err)
            setError(err.message || 'Upload failed')
        } finally {
            setLoading(false)
        }
    }

    const removeImage = () => {
        setImage(null)
        setpreviewShow(true)
        if (inputRef.current) inputRef.current.value = null
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Upload Cattle Image</h2>

            <div
                role="button"
                tabIndex={0}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => inputRef.current && inputRef.current.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center flex-col gap-3 cursor-pointer hover:border-amber-400 transition-colors"
                aria-label="Drop image here or click to select"
            >
                {preview && previewShow? (

                    <div className="text-center text-gray-500">
                        <img src={preview.url} alt="preview" className="w-56 h-56 object-cover rounded" />
                        <p className="font-medium">{preview.name}</p>
                        <p>Size: {formatFileSize(preview.size)}</p>
                    </div>


                ) : (
                    <div className="text-center text-gray-500">
                        <p className="font-medium">Drag & drop an image here</p>
                        <p className="text-sm">or click to browse</p>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                />
            </div>

            <div className="mt-4 flex gap-3">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 bg-amber-500 text-white rounded disabled:opacity-60"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            Uploading...
                        </span>
                    ) : (
                        'Submit'
                    )}
                </button>

                <button onClick={removeImage} className="px-4 py-2 border rounded">
                    Remove
                </button>
            </div>



            {error && <p className="mt-3 text-sm text-red-600">Error: {error}</p>}

            {result && <h3 className="font-semibold">Prediction</h3>}
            {result &&  <div key={result[0].class} className="mt-6 p-4  border rounded shadow-sm">
                <h2>🐄 Breed Details  </h2>
                <div className='flex gap-7' >
                    <img src={preview.url} alt="preview" className="w-56 h-56 object-cover rounded" />
                    <div className='flex flex-col'>
                        <span>breed name</span>
                        <span>Scientific Name</span>
                       

                    </div>
                </div>

                <div className='flex flex-col'>
                    <span>📍 Origin            Gujarat, India  </span>
                    <span>🥛 Milk Production   12–18 L/day   </span>
                    <span>⚖ Average Weight    Male: 550–650 kg                         |
                        │                    Female: 380–480 kg </span>
                    <span>🎨 Coat Color        Red / White spotted  </span>
                    <span> 🦌 Horn Type         Long, curved outward</span>
                    <span>🌡 Climate           Hot & Dry       </span>
                    <span>🎯 Purpose           Dairy  </span>
                </div>

                <pre className="whitespace-pre-wrap text-sm mt-2">diseases : {result[0].class}</pre>
                <pre className="whitespace-pre-wrap text-sm mt-2">confidence : {result[0].confidence * 100}%</pre>
            </div>
            }
        </div>
    )
}

export default InputImage
