namespace Learning.Shared.Pagination;

public class CursorPagedResult<T>
{
    public T[] Items { get; set; } = [];
    public int PageSize { get; set; }
    public string NextCursor { get; set; }

    public CursorPagedResult() { }

    public CursorPagedResult(T[] items, string nextCursor, int pageSize)
    {
        Items = items;
        NextCursor = nextCursor;
        PageSize = pageSize;
    }
}