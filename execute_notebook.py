import nbformat
from nbconvert.preprocessors import ExecutePreprocessor

notebook_filename = '/Users/macintoshhd/Desktop/Intuit/intuit_fraud_risk_analysis.ipynb'
output_filename = '/Users/macintoshhd/Desktop/Intuit/intuit_fraud_risk_analysis_executed.ipynb'

with open(notebook_filename) as f:
    nb = nbformat.read(f, as_version=4)

ep = ExecutePreprocessor(timeout=600, kernel_name='python3')

print("Executing notebook...")
ep.preprocess(nb, {'metadata': {'path': '/Users/macintoshhd/Desktop/Intuit/'}})
print("Execution complete.")

with open(output_filename, 'w', encoding='utf-8') as f:
    nbformat.write(nb, f)
print("Saved executed notebook.")
