import app from './app';
import { initializeDB } from './config/orm.config';

const port = process.env.PORT || 3000;


async function startServer(): Promise<void> {
    await initializeDB();

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer().then(r => r).catch(e => {
    console.error(e);
    process.exit(1);
});