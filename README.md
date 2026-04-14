# Mortgage Calculation Service (NestJS)

## Требования

- Node (20+)
- MySQL docker
- Redis docker

## Swagger

`http://localhost:5094/api/docs`

## Быстрый старт

```bash
cp .env.example .env
# заполнить энвы

# запустить докер контейнеры для бд и редиса (вне этого гайда уже)

npm install
npm run db:migrate
npm run dev
```

## Диаграмма

Блок-схема в FigJam: [FigJam](https://www.figma.com/board/sjZxLnhKCGO4VHOrcCxZvf/%D0%91%D0%BB%D0%BE%D0%BA-%D1%81%D1%85%D0%B5%D0%BC%D0%B0-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B-%D0%B8%D0%BF%D0%BE%D1%82%D0%B5%D1%87%D0%BD%D0%BE%D0%B3%D0%BE-%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%D0%B0?node-id=0-1&t=Q2P0G00BjPIzPh9E-1)
