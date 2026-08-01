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
    const [grainInfo, setgrainInfo] = useState(null)

    const setImage = (imageFile) => {
        setFile(imageFile)
        setResult(null)
        setError(null)
        setPreview(imageFile ? { url: URL.createObjectURL(imageFile), size: imageFile.size, name: imageFile.name } : null)
    }

    const handleFileChange = (e) => {
        setpreviewShow(true)
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleDrop = (e) => {
        setpreviewShow(true)

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
            console.log("before api request")
            const resp = await fetch('https://grain-classification-model.onrender.com/predict', {
                method: 'POST',
                headers: { "x-api-key": "aed6f9dc0eaebe66d077a248951915f9" },
                body: formData,
            })
            console.log(resp)
            const data = await resp.json()
            setResult(data);
            console.log(data)
            console.log("after api request")



            if (!resp.ok) throw new Error(`Server error: ${resp.status}`)

            const response = await fetch("/api/grain-info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    grain: data.predicted_label
                })
            });

            const grain_info = await response.json();
            console.log(grain_info);

            setgrainInfo(grain_info);





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
    console.log("grainInfo state:", grainInfo);
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.14),_transparent_40%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Upload Cattle Image</h2>

                <div
                    role="button"
                    tabIndex={0}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => inputRef.current && inputRef.current.click()}
                    className="group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-white/15 bg-slate-950/40 px-5 py-8 text-center transition-all duration-300 hover:border-amber-400 hover:bg-white/10 hover:shadow-[0_0_0_1px_rgba(251,191,36,0.18)] focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:ring-offset-0 sm:px-8"
                    aria-label="Drop image here or click to select"
                >
                    {preview && previewShow ? (

                        <div className="space-y-3 text-center text-slate-300">
                            <img src={preview.url} alt="preview" className="mx-auto h-64 w-64 rounded-2xl object-cover ring-1 ring-white/10 shadow-lg shadow-black/40 sm:h-72 sm:w-72" />
                            <p className="font-medium text-white">{preview.name}</p>
                            <p className="text-sm text-slate-400">Size: {formatFileSize(preview.size)}</p>
                        </div>


                    ) : (
                        <div className="space-y-1 text-center text-slate-400">
                            <p className="text-lg font-medium text-white">Drag & drop an image here</p>
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

                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-amber-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                Uploading...
                            </span>
                        ) : (
                            'Submit'
                        )}
                    </button>

                    <button onClick={removeImage} className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-100 transition-colors duration-200 hover:border-white/20 hover:bg-white/10">
                        Remove
                    </button>
                </div>



                {error && <p className="text-sm text-rose-400">Error: {error}</p>}

                {result && <h3 className="text-xl font-semibold tracking-tight text-white">Prediction</h3>}
                {result && <div className="mt-2 rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-xl shadow-black/30 backdrop-blur sm:p-6">
                    <h2 className="text-xl font-semibold text-white">🐄 Breed Details  </h2>
                    <div className='mt-4 flex flex-col gap-5 md:flex-row md:items-start md:gap-7' >
                        <img src={preview.url} alt="preview" className="h-56 w-full rounded-2xl object-cover ring-1 ring-white/10 md:w-56" />
                        <div className='flex flex-col gap-1 text-slate-200'>
                            <span className="text-sm uppercase tracking-[0.2em] text-amber-300/80">breed name</span>
                            <span className="text-lg font-medium text-white">Scientific Name</span>
                            <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-100">diseases : {result.predicted_label
                            }</pre>
                            <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-100">confidence : {(result.confidence * 100).toFixed(2)}%</pre>


                        </div>
                    </div>

                    {grainInfo && (
                        <div className="mt-5 space-y-6">

                            {/* Basic Information */}
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <h3 className="mb-4 text-lg font-semibold text-amber-300">
                                    🌾 Basic Information
                                </h3>

                                <div className="grid gap-2 sm:grid-cols-2">
                                    <span>🌾 <strong>Grain Name:</strong> {grainInfo.grainName}</span>
                                    <span>🔬 <strong>Scientific Name:</strong> {grainInfo.scientificName}</span>
                                    <span>📍 <strong>Origin:</strong> {grainInfo.origin}</span>
                                    <span>🌱 <strong>Crop Type:</strong> {grainInfo.cropType}</span>
                                    <span>🌿 <strong>Family:</strong> {grainInfo.family}</span>
                                </div>
                            </div>

                            {/* Nutritional Information */}
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <h3 className="mb-4 text-lg font-semibold text-amber-300">
                                    🥗 Nutritional Information
                                </h3>

                                <div className="grid gap-2 sm:grid-cols-2">
                                    <span>🔥 Calories: {grainInfo.nutritionalInformation.calories}</span>
                                    <span>🍞 Carbohydrates: {grainInfo.nutritionalInformation.carbohydrates}</span>
                                    <span>💪 Protein: {grainInfo.nutritionalInformation.protein}</span>
                                    <span>🧈 Fat: {grainInfo.nutritionalInformation.fat}</span>
                                    <span>🌿 Fiber: {grainInfo.nutritionalInformation.fiber}</span>

                                    <span className="sm:col-span-2">
                                        🧂 Minerals: {grainInfo.nutritionalInformation.minerals.join(", ")}
                                    </span>

                                    <span className="sm:col-span-2">
                                        🥗 Vitamins: {grainInfo.nutritionalInformation.vitamins.join(", ")}
                                    </span>
                                </div>
                            </div>

                            {/* Growing Conditions */}
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <h3 className="mb-4 text-lg font-semibold text-amber-300">
                                    🌱 Growing Conditions
                                </h3>

                                <div className="grid gap-2 sm:grid-cols-2">
                                    <span>🌡 Temperature: {grainInfo.growingConditions.temperature}</span>
                                    <span>🌧 Rainfall: {grainInfo.growingConditions.rainfall}</span>
                                    <span>🌱 Soil Type: {grainInfo.growingConditions.soilType}</span>
                                    <span>💧 Water Requirement: {grainInfo.growingConditions.waterRequirement}</span>
                                    <span>☀ Growing Season: {grainInfo.growingConditions.growingSeason}</span>
                                </div>
                            </div>

                            {/* Uses */}
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <h3 className="mb-4 text-lg font-semibold text-amber-300">
                                    🍞 Uses
                                </h3>

                                <div className="grid gap-2 sm:grid-cols-2">
                                    <span>
                                        🍽 Food Products: {grainInfo.uses.foodProducts.join(", ")}
                                    </span>

                                    <span>
                                        🐄 Animal Feed: {grainInfo.uses.animalFeed ? "Yes" : "No"}
                                    </span>

                                    <span>
                                        🏭 Industrial Uses: {grainInfo.uses.industrialUses.join(", ")}
                                    </span>

                                    <span>🌾 Flour: {grainInfo.uses.flour ? "Yes" : "No"}</span>
                                    <span>🍜 Noodles: {grainInfo.uses.noodles ? "Yes" : "No"}</span>
                                    <span>🍪 Biscuits: {grainInfo.uses.biscuits ? "Yes" : "No"}</span>
                                </div>
                            </div>

                            {/* Health Benefits */}
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <h3 className="mb-4 text-lg font-semibold text-amber-300">
                                    ❤️ Health Benefits
                                </h3>

                                <ul className="list-disc space-y-1 pl-6">
                                    {grainInfo.healthBenefits.map((benefit, index) => (
                                        <li key={index}>{benefit}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Storage Guidelines */}
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <h3 className="mb-4 text-lg font-semibold text-amber-300">
                                    📦 Storage Guidelines
                                </h3>

                                <div className="grid gap-2 sm:grid-cols-2">
                                    <span>
                                        🌡 Ideal Temperature: {grainInfo.storageGuidelines.idealTemperature}
                                    </span>

                                    <span>
                                        💦 Moisture Content: {grainInfo.storageGuidelines.moistureContent}
                                    </span>

                                    <span className="sm:col-span-2">
                                        📦 Storage Method: {grainInfo.storageGuidelines.storageMethod}
                                    </span>

                                    <span>
                                        ⏳ Shelf Life: {grainInfo.storageGuidelines.shelfLife}
                                    </span>
                                </div>
                            </div>

                        </div>
                    )}


                </div>
                }
            </div>
        </div>
    )
}

export default InputImage
