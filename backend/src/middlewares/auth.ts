import { auth } from '@/utils/auth/auth.js'
import { type Context, type Next } from 'hono'

export const requireAuth = async (c: Context, next: Next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })

    if (!session || !session.user) {
        return c.json(
            {
                success: false,
                message: 'Unauthorized',
                error: 'No valid session found',
            },
            401
        )
    }

    c.set('user', session.user)
    c.set('session', session.session)

    return await next()
}

export const requireDoctor = async (c: Context, next: Next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })

    if (!session || !session.user) {
        return c.json(
            {
                success: false,
                message: 'Unauthorized',
                error: 'No valid session found',
            },
            401
        )
    }

    if (session.user.role !== 'doctor') {
        return c.json(
            {
                success: false,
                message: 'Forbidden',
                error: 'Only doctors can access this resource',
            },
            403
        )
    }

    c.set('user', session.user)
    c.set('session', session.session)

    return await next()
}

export const requireNurse = async (c: Context, next: Next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })

    if (!session || !session.user) {
        return c.json(
            {
                success: false,
                message: 'Unauthorized',
                error: 'No valid session found',
            },
            401
        )
    }

    if (session.user.role !== 'nurse') {
        return c.json(
            {
                success: false,
                message: 'Forbidden',
                error: 'Only nurses can access this resource',
            },
            403
        )
    }

    c.set('user', session.user)
    c.set('session', session.session)

    return await next()
}