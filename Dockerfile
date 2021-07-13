FROM python:3-alpine

RUN pip install requests
COPY run.py /run.py

CMD ["python", "/run.py"]
