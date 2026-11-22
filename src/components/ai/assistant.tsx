"use client";

import { useState } from "react";

export function Assistant() {
  const [question,setQuestion]=useState(""); const [answer,setAnswer]=useState(""); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setError(""); setAnswer(""); try { const response=await fetch("/api/assistant",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({question})}); const body=await response.json(); if(!response.ok) throw new Error(body.error ?? "Could not get an answer."); setAnswer(body.answer); } catch(e) { setError(e instanceof Error?e.message:"Request failed."); } finally {setBusy(false);} }
  return <div className="grid gap-5"><form onSubmit={submit} className="grid gap-3"><label htmlFor="question" className="text-sm font-medium">Ask about your spending or savings</label><textarea id="question" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={1000} required rows={4} placeholder="For example: How much did I spend on food this month?" className="rounded-md border bg-background p-3"/><div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">Uses your summarized records for the current month.</span><button disabled={busy} className="h-10 rounded-md bg-primary px-4 font-medium text-primary-foreground disabled:opacity-60">{busy?"Thinking…":"Ask assistant"}</button></div></form>
    {error&&<p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm">{error}</p>}{answer&&<section aria-live="polite" className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 text-sm leading-6"><h2 className="mb-2 font-semibold">Assistant response</h2>{answer}<p className="mt-4 border-t pt-3 text-xs text-muted-foreground">Suggestions are informational and do not replace professional financial advice or verified calculations.</p></section>}</div>;
}
