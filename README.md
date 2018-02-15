# Wagtail + Vue

## Setup
```shell
virtualenv venv
pip install requirements.txt

npm install
# or
yarn
```

Copy `main/local_settings.py.example` to `main/local_settings.py`

Create new Postgres database and add credentials to `main/local_settings.py`

## Running

```shell
npm run dev # Starts webpack dev server and runs ./manage.py runserver
```

## Building

```shell
npm run build
```

