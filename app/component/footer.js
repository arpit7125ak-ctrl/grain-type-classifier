export default function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h3 className="mb-5 text-center text-lg font-semibold text-white">
          👨‍💻 Project Contributors
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Arpit */}
          <div className="flex h-fit justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg transition hover:border-amber-400">
          <div>
            <h4 className="text-lg font-semibold text-white">
              Arpit Kumar
            </h4>
            <p className="mt-1 text-sm text-slate-400">
              Frontend Development
            </p>
          </div>

            <div className=" space-y-2">
              <a
                href="https://www.linkedin.com/in/arpit-kumar-1b9362368/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-400 transition hover:text-blue-300"
              >
                🔗 LinkedIn
              </a>

              <a
                href="https://github.com/arpit7125ak-ctrl/grain-type-classifier"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 transition hover:text-white"
              >
                💻 GitHub
              </a>
            </div>
          </div>

          {/* Gaurav */}

          <div className="flex justify-between h-fit rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg transition hover:border-amber-400">
          <div>
            <h4 className="text-lg font-semibold text-white">
              Gaurav Gupta
            </h4>
            <p className="mt-1 text-sm text-slate-400">
              Machine Learning Model
            </p>
          </div>


            <div className=" space-y-2">
              <a
                href="https://www.linkedin.com/in/gaurav-gupta-79754a377/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-400 transition hover:text-blue-300"
              >
                🔗 LinkedIn
              </a>

              <a
                href="https://github.com/gaurav082507-lang"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 transition hover:text-white"
              >
                💻 GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-800 pt-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Grain Classification Project. Built
          with using Next.js, React & AI.
        </div>
      </div>
    </footer>
  );
}